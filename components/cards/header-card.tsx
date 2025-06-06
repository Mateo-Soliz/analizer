import { CardDescription, CardHeader, CardTitle } from "../primitives/card";

export const HeaderCard = ({ title, description }: { title: string; description: string }) => (
  <CardHeader className="pb-2">
    <div className="flex justify-between items-start">
      <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
    </div>
    <CardDescription className="line-clamp-2">
      {description}
    </CardDescription>
  </CardHeader>
);
