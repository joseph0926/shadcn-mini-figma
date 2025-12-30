import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function CardRenderer({ node }: NodeRendererProps) {
  const title = (node.props.title as string) ?? "Card Title";
  const description = (node.props.description as string) ?? "Card description";

  return (
    <Card className="w-[300px] pointer-events-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Card content goes here</p>
      </CardContent>
    </Card>
  );
}
