import { Radio as RadioHero, cn } from "@heroui/react";
import { RadioProps } from "./type";

const Radio = ({ children, ...props }: RadioProps) => {
  return (
    <RadioHero
      {...props}
      //   className="bg-transparent hover:bg-green-5"
      classNames={{
        base: cn(
          "m-0 items-center border-transparent p-4",
          "data-[selected=true]:border-transparent"
        ),
      }}
    />
  );
};

export default Radio;
