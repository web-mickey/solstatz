"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatBlockProps {
  title: string;
  value: string | React.ReactNode;
  description?: string;
}

export default function StatBlock(props: StatBlockProps) {
  const { title, value, description } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-md text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
