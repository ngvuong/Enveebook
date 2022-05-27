import {
  format,
  formatRelative,
  formatDistanceToNowStrict,
  parseISO,
} from 'date-fns';

export const formatDate = (date, type = 'long') => {
  const parsedDate = parseISO(date);

  if (type === 'long') {
    const relativeDate = formatRelative(parsedDate, new Date());
    if (relativeDate.includes('last')) {
      return format(parsedDate, "MMM dd 'at' h:mm a");
    } else if (relativeDate.includes('/')) {
      return format(parsedDate, 'MMM dd, yyyy');
    }

    return relativeDate[0].toUpperCase() + relativeDate.slice(1);
  } else if (type === 'short') {
    const timeArr = formatDistanceToNowStrict(parsedDate).split(' ');
    const time = timeArr[0] + timeArr[1].substring(0, 1);

    return time;
  }
};
