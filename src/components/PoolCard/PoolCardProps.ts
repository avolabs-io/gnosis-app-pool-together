type PoolCardProps = {
  prizeValue: string;
  tokenSymbol: string;
  tokenImageUrl: string;
  userBalance: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
  prizeGivingTimestamp: string;
};

export default PoolCardProps;
