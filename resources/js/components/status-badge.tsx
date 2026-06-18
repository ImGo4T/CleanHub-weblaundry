import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    red: 'bg-red-100 text-red-800 border-red-200',
};

interface StatusBadgeProps {
    color: string;
    label: string;
    className?: string;
}

export function StatusBadge({ color, label, className }: StatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn(colorMap[color] || colorMap.blue, className)}>
            {label}
        </Badge>
    );
}
