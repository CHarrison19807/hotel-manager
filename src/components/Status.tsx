interface StatusProps {
  goodText: string;
  badText: string;
  status: boolean;
  desired: boolean;
}
const Status = ({ goodText, badText, status, desired }: StatusProps) => {
  const goodStyle =
    "inline-flex items-center justify-center rounded-md font-medium bg-green-600 text-primary-foreground h-8 px-4 py-2 w-auto";
  const badStyle =
    "inline-flex items-center justify-center rounded-md font-medium bg-destructive text-primary-foreground h-8 px-4 py-2 w-auto";
  if (status === desired) {
    return <span className={goodStyle}>{goodText}</span>;
  }
  return <span className={badStyle}>{badText}</span>;
};

export default Status;
