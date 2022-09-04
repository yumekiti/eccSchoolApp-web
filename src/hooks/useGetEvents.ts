import Event, { CalendarEvent } from 'types/event';
import axios from 'axios';
import userDataState from 'globalState/userDataState';
import { atomFamily, useRecoilState, useRecoilValue } from 'recoil';
import UserData from 'types/userInfo';

type SelectedDate = {
  year: number;
  month: number;
};

export const eventAtom = atomFamily<null | CalendarEvent[], string>({
  key: 'eventAtom',
  default: null,
});

const getEvents = async (
  userData: UserData,
  selectedDate: SelectedDate,
): Promise<CalendarEvent[]> => {
  const { data } = await axios.get<Event[]>(
    `${process.env.REACT_APP_API_URL}/${userData.uuid}/calendar/${
      selectedDate.year
    }/${
      selectedDate.month < 10 ? `0${selectedDate.month}` : selectedDate.month
    }`,
    {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    },
  );

  return data.map((d) => ({
    allDay: true,
    title: d.plans.title[0],
    start: new Date(selectedDate.year, selectedDate.month - 1, Number(d.day)),
    end: new Date(selectedDate.year, selectedDate.month - 1, Number(d.day)),
  }));
};

const useGetEvents = (selectedDate: SelectedDate) => {
  const userData = useRecoilValue(userDataState);
  const [event, setEvent] = useRecoilState(
    eventAtom(`${selectedDate.year}-${selectedDate.month}`),
  );
  if (event === null) {
    getEvents(userData, selectedDate).then((d) => {
      setEvent(d);
    });
  }
  return event;
};

export default useGetEvents;
