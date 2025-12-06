import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../..');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truestate';
const BATCH_SIZE = 1000;
const CSV_FILE_PATH = path.join(rootDir, 'TruEstate/truestate_assignment_dataset.csv');

function parseTags(tagsString) {
    if (!tagsString || tagsString.trim() === '') return [];
    let cleaned = tagsString.trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
    }
    return cleaned.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

function parseDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
}

function mapRowToDocument(row) {
    return {
        transactionID: parseInt(row['Transaction ID'], 10),
        date: parseDate(row['Date']),
        customerID: row['Customer ID'],
        customerName: row['Customer Name'],
        phone: row['Phone Number'],
        gender: row['Gender'],
        age: parseInt(row['Age'], 10),
        region: row['Customer Region'],
        customerType: row['Customer Type'],
        productID: row['Product ID'],
        productName: row['Product Name'],
        brand: row['Brand'],
        productCategory: row['Product Category'],
        tags: parseTags(row['Tags']),
        quantity: parseInt(row['Quantity'], 10),
        pricePerUnit: parseFloat(row['Price per Unit']),
        discountPercentage: parseFloat(row['Discount Percentage']),
        amount: parseFloat(row['Total Amount']),
        finalAmount: parseFloat(row['Final Amount']),
        paymentMethod: row['Payment Method'],
        status: row['Order Status'],
        deliveryType: row['Delivery Type'],
        storeID: row['Store ID'],
        storeLocation: row['Store Location'],
        employeeID: row['Employee ID'],
        employeeName: row['Employee Name']
    };
}

async function seed() {
    console.log('🚀 Starting TruEstate Data Seeder (Native Driver)...\n');
    console.log(`📁 CSV File: ${CSV_FILE_PATH}`);
    console.log(`🔗 MongoDB: ${MONGODB_URI}\n`);

    if (!fs.existsSync(CSV_FILE_PATH)) {
        console.error('❌ Error: CSV file not found at', CSV_FILE_PATH);
        process.exit(1);
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('📡 Connecting to MongoDB...');
        await client.connect();
        const db = client.db();
        const collection = db.collection('transactions');
        console.log(`✓ Connected to database: ${db.databaseName}\n`);

        // Drop existing collection
        try {
            await collection.drop();
            console.log('  Dropped existing transactions collection\n');
        } catch (e) {
            console.log('  No existing collection to drop\n');
        }

        console.log('📖 Reading CSV file...\n');

        const allDocuments = [];
        let rowCount = 0;

        await new Promise((resolve, reject) => {
            fs.createReadStream(CSV_FILE_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    allDocuments.push(mapRowToDocument(row));
                    rowCount++;
                    if (rowCount % 100000 === 0) {
                        console.log(`  Read ${rowCount.toLocaleString()} rows...`);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`\n✓ Read ${allDocuments.length.toLocaleString()} total records\n`);
        console.log('First document sample:');
        console.log(JSON.stringify(allDocuments[0], null, 2));
        console.log('\n');

        const startTime = Date.now();
        let insertedCount = 0;
        let batchNum = 0;

        for (let i = 0; i < allDocuments.length; i += BATCH_SIZE) {
            batchNum++;
            const batch = allDocuments.slice(i, i + BATCH_SIZE);

            try {
                const result = await collection.insertMany(batch, { ordered: false });
                insertedCount += result.insertedCount;

                if (batchNum % 100 === 0 || batchNum <= 3) {
                    console.log(`✓ Batch ${batchNum}: Inserted ${result.insertedCount} (Total: ${insertedCount.toLocaleString()})`);
                }
            } catch (error) {
                console.error(`✗ Batch ${batchNum} ERROR:`, error.message);
                if (error.result && error.result.insertedCount) {
                    insertedCount += error.result.insertedCount;
                }
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n═══════════════════════════════════════');
        console.log('         SEEDING COMPLETE             ');
        console.log('═══════════════════════════════════════');
        console.log(`📊 Total Records Read: ${allDocuments.length.toLocaleString()}`);
        console.log(`📊 Records Inserted: ${insertedCount.toLocaleString()}`);
        console.log(`⏱️  Time Elapsed: ${duration}s`);
        console.log('═══════════════════════════════════════\n');

        const count = await collection.countDocuments();
        console.log(`✓ Verification: ${count.toLocaleString()} documents in collection`);

        // Create indexes
        console.log('\n📇 Creating indexes...');
        await collection.createIndex({ transactionID: 1 }, { unique: true });
        await collection.createIndex({ date: 1 });
        await collection.createIndex({ phone: 1 });
        await collection.createIndex({ region: 1 });
        await collection.createIndex({ status: 1 });
        await collection.createIndex({ productCategory: 1 });
        await collection.createIndex({ paymentMethod: 1 });
        await collection.createIndex({ customerName: 'text', productName: 'text' });
        console.log('✓ Indexes created');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

seed();
