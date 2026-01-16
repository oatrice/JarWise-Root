export type Jar = {
    id: string;
    name: string;
    current: number;
    goal: number;
    level: number;
    color: string;
    bgGlow: string;
    icon: string; // Changed from LucideIcon to string for JSON serialization
    barColor: string;
    shadowColor: string;
}

export type Transaction = {
    id: string;
    merchant: string;
    amount: number;
    category: string;
    date: string;
    isTaxDeductible: boolean;
    color: string;
    icon: string; // Changed from LucideIcon to string for JSON serialization
}
