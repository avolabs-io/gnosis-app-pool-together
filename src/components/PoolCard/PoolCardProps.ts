type PoolCardProps = {
  poolIndex: string;
  prizeValue: string;
  tokenSymbol: string;
  tokenImageUrl: string;
  userBalance: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
  secondsRemaining: number;
};

export default PoolCardProps;
