const separator = '-';

export function buildJobName(contractName: string, eventName: string): string {
  return `${contractName}${separator}${eventName}`;
}
export function parseJobName(jobName: string): {
  eventName: string;
  contractName: string;
} {
  const parts = jobName.split(separator);
  return {
    eventName: parts[0],
    contractName: parts[1],
  };
}
