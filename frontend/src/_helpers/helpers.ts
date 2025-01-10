const retrieveLocalStorageData = <T, >(key: string) => {

  const pairJSON = localStorage.getItem(key) || '';
  if (!pairJSON) {
    return {} as T;
  }
  const pair = JSON.parse(pairJSON);
  return pair as T;

}

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export {
  retrieveLocalStorageData,
  formatDateTime,
  formatDate
}