import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, description, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Card>
  );
};

export default StatsCard;
