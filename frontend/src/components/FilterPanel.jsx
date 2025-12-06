import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    MapPin,
    Users,
    CreditCard,
    Tag,
    ShoppingBag,
    Truck,
    CheckCircle2,
    X,
    Calendar
} from 'lucide-react';

function AccordionSection({ title, icon: Icon, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-surface-700/30 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="accordion-trigger"
            >
                <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="w-4 h-4 text-primary-400" />
                    {title}
                </span>
                {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-surface-500" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 pt-2 animate-slide-down">
                    {children}
                </div>
            )}
        </div>
    );
}

function CheckboxGroup({ options = [], selected = [], onChange }) {
    const handleToggle = (value) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
                <div
                    key={option}
                    onClick={() => handleToggle(option)}
                    className="flex items-center gap-2 cursor-pointer group"
                    role="checkbox"
                    aria-checked={selected.includes(option)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggle(option);
                        }
                    }}
                >
                    <div className={`
                        w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center
                        ${selected.includes(option)
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-surface-500 group-hover:border-primary-400'}
                    `}>
                        {selected.includes(option) && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                    </div>
                    <span className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors select-none">
                        {option}
                    </span>
                </div>
            ))}
        </div>
    );
}

function RangeSlider({ label, min = 0, max = 100, value, onChange }) {
    const [localMin, localMax] = value || [min, max];

    return (
        <div className="space-y-3">
            <div className="flex justify-between text-xs text-surface-400">
                <span>{label}</span>
                <span className="font-mono">{localMin} - {localMax}</span>
            </div>
            <div className="flex gap-2">
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={localMin}
                    onChange={(e) => onChange([parseInt(e.target.value) || min, localMax])}
                    className="input-field text-center text-sm py-1.5"
                    placeholder="Min"
                />
                <span className="text-surface-500 self-center">-</span>
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={localMax}
                    onChange={(e) => onChange([localMin, parseInt(e.target.value) || max])}
                    className="input-field text-center text-sm py-1.5"
                    placeholder="Max"
                />
            </div>
        </div>
    );
}

function ActiveFilters({ filters, onRemove, onClearAll }) {
    const activeFilters = [];

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
            value.forEach(v => activeFilters.push({ key, value: v }));
        } else if (value && !Array.isArray(value)) {
            activeFilters.push({ key, value });
        }
    });

    if (activeFilters.length === 0) return null;

    return (
        <div className="p-3 border-b border-surface-700/30">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-surface-400">Active Filters</span>
                <button
                    onClick={onClearAll}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                    Clear all
                </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {activeFilters.map((filter, idx) => (
                    <span
                        key={`${filter.key}-${filter.value}-${idx}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30"
                    >
                        {filter.value}
                        <button
                            onClick={() => onRemove(filter.key, filter.value)}
                            className="hover:text-primary-100 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function FilterPanel({
    filterOptions = {},
    filters = {},
    onFilterChange,
    isLoading = false
}) {
    const {
        regions = [],
        genders = [],
        paymentMethods = [],
        statuses = [],
        productCategories = [],
        deliveryTypes = [],
        tags = [],
        ageRange = { min: 0, max: 100 },
        amountRange = { min: 0, max: 100000 },
    } = filterOptions;

    const handleFilterChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleRemoveFilter = (key, value) => {
        if (Array.isArray(filters[key])) {
            handleFilterChange(key, filters[key].filter(v => v !== value));
        } else {
            handleFilterChange(key, null);
        }
    };

    const handleClearAll = () => {
        onFilterChange({});
    };

    if (isLoading) {
        return (
            <div className="glass-card p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-10 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-surface-700/50">
                <h2 className="text-lg font-semibold text-surface-100">Filters</h2>
            </div>

            <ActiveFilters
                filters={filters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAll}
            />

            <div className="divide-y divide-surface-700/30">
                <AccordionSection title="Region" icon={MapPin} defaultOpen>
                    <CheckboxGroup
                        options={regions}
                        selected={filters.region || []}
                        onChange={(value) => handleFilterChange('region', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Gender" icon={Users}>
                    <CheckboxGroup
                        options={genders}
                        selected={filters.gender || []}
                        onChange={(value) => handleFilterChange('gender', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Order Status" icon={ShoppingBag}>
                    <CheckboxGroup
                        options={statuses}
                        selected={filters.status || []}
                        onChange={(value) => handleFilterChange('status', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Payment Method" icon={CreditCard}>
                    <CheckboxGroup
                        options={paymentMethods}
                        selected={filters.paymentMethod || []}
                        onChange={(value) => handleFilterChange('paymentMethod', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Category" icon={Tag}>
                    <CheckboxGroup
                        options={productCategories}
                        selected={filters.productCategory || []}
                        onChange={(value) => handleFilterChange('productCategory', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Delivery Type" icon={Truck}>
                    <CheckboxGroup
                        options={deliveryTypes}
                        selected={filters.deliveryType || []}
                        onChange={(value) => handleFilterChange('deliveryType', value)}
                    />
                </AccordionSection>

                <AccordionSection title="Tags" icon={Tag}>
                    <CheckboxGroup
                        options={tags.slice(0, 20)}
                        selected={filters.tags || []}
                        onChange={(value) => handleFilterChange('tags', value)}
                    />
                    {tags.length > 20 && (
                        <p className="text-xs text-surface-500 mt-2">
                            Showing top 20 tags
                        </p>
                    )}
                </AccordionSection>

                <AccordionSection title="Age Range" icon={Users}>
                    <RangeSlider
                        label="Customer Age"
                        min={ageRange.min}
                        max={ageRange.max}
                        value={[filters.minAge || ageRange.min, filters.maxAge || ageRange.max]}
                        onChange={([minAge, maxAge]) => {
                            handleFilterChange('minAge', minAge);
                            handleFilterChange('maxAge', maxAge);
                        }}
                    />
                </AccordionSection>

                <AccordionSection title="Amount Range" icon={CreditCard}>
                    <RangeSlider
                        label="Transaction Amount"
                        min={0}
                        max={Math.ceil(amountRange.max / 1000) * 1000}
                        value={[filters.minAmount || 0, filters.maxAmount || amountRange.max]}
                        onChange={([minAmount, maxAmount]) => {
                            handleFilterChange('minAmount', minAmount);
                            handleFilterChange('maxAmount', maxAmount);
                        }}
                    />
                </AccordionSection>

                <AccordionSection title="Date Range" icon={Calendar}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-surface-400 block mb-1">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="input-field text-sm py-1.5"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-surface-400 block mb-1">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="input-field text-sm py-1.5"
                            />
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
