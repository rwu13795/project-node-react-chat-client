import { memo } from "react";

// UI //
import styles from "./ChatTimeline.module.css";

interface Props {
  currentTime: Date;
  created_at: string;
  next_created_at: string;
}

const oneMin = 1000 * 60;
const oneHour = 1000 * 60 * 60;

function ChatTimeline({
  currentTime,
  created_at,
  next_created_at,
}: Props): JSX.Element {
  // in micro second
  const ms_created_at = new Date(created_at).getTime();
  const ms_next_created_at = new Date(next_created_at).getTime();
  const diff = ms_created_at - ms_next_created_at;

  let showTimeline = false;
  if (next_created_at !== "") {
    // show new timeline if two messages are 60 seconds apart from each other
    if (diff > oneMin) {
      showTimeline = true;
    }
  } else {
    showTimeline = true;
  }

  let timeline: string = "";
  const currentMS = currentTime.getTime();
  const timeAgo = currentMS - ms_created_at;
  // less than 1 hour
  if (timeAgo < oneMin * 59) {
    const min = Math.ceil(timeAgo / oneMin);
    timeline = min > 1 ? `${min} minutes ago` : "Just now";
  }
  // between 1 and 3 hour
  else if (timeAgo >= oneHour && timeAgo < oneHour * 3) {
    const hour = Math.floor(timeAgo / oneHour);
    const second = timeAgo % oneHour;
    const min = Math.ceil(second / oneMin);
    if (min > 0) {
      timeline = `${hour} hour${hour > 1 ? "s" : ""} ${min} minute${
        min > 1 ? "s" : ""
      } ago`;
    } else {
      timeline = `${hour} hour${hour > 1 ? "s" : ""} ago`;
    }
  } else {
    const date = new Date(created_at).toDateString();
    const time = getHourAndMinute(new Date(created_at));
    // if the message is created in the current year, dont display the year
    if (new Date(created_at).getFullYear() === currentTime.getFullYear()) {
      timeline = date.substring(0, date.length - 4) + " - " + time;
    } else {
      timeline = date + " - " + time;
    }
  }

  return showTimeline ? (
    <main className={styles.main}>
      <div className={styles.timeline_wrapper}>
        <div className={styles.line}></div>
        <div className={styles.timeline}>{timeline}</div>
        <div className={styles.line}></div>
      </div>
    </main>
  ) : (
    <div style={{ display: "none" }}></div>
  );
}

export default memo(ChatTimeline);

function getHourAndMinute(time: Date) {
  return time.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
