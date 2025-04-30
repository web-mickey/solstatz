import Image from "next/image";

interface SolIconProps {
  size?: number;
}

export const SolIcon = (props: SolIconProps) => {
  const { size = 24 } = props;
  return (
    <Image src="/solanaLogoMark.svg" alt="SOL" width={size} height={size} />
  );
};
