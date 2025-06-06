import { MoreVertical } from "lucide-react";
import { Button } from "../primitives/button";
import { CardDescription, CardHeader, CardTitle } from "../primitives/card";

export const HeaderCard = ({ title, description }: { title: string; description: string }) => (
  <CardHeader className="pb-2">
    <div className="flex justify-between items-start">
      <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
      <Button variant="ghost" size="sm">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
    <CardDescription className="line-clamp-2">
      {description}
    </CardDescription>
  </CardHeader>
);
