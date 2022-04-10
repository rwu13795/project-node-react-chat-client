import { memo, useEffect, useRef, useState } from "react";

import styles from "./EmojiPicker.module.css";

interface Props {
  emojiPickerRef: React.MutableRefObject<HTMLDivElement | null>;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
}
interface ListProps {
  emojiList: string[];
  onEmojiClickHandler: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
}

function EmojiPicker({ emojiPickerRef, setMessageValue }: Props): JSX.Element {
  const [recentEmoji, setRecentEmoji] = useState<string[]>([]);

  useEffect(() => {
    const savedEmoji = localStorage.getItem("recent_emoji");
    if (savedEmoji) {
      setRecentEmoji(JSON.parse(savedEmoji));
    }
  }, []);

  function onEmojiClickHandler(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    isRecentList?: boolean
  ) {
    const emoji = e.currentTarget.innerText;
    setMessageValue((prev) => prev + emoji);
    if (isRecentList) return;
    if (emoji === recentEmoji[0]) return;

    const newRecent = recentEmoji;
    if (recentEmoji.length < 8) {
      newRecent.unshift(emoji);
      setRecentEmoji([...newRecent]);
      localStorage.setItem("recent_emoji", JSON.stringify(newRecent));
    } else {
      newRecent.pop();
      newRecent.unshift(emoji);
      setRecentEmoji([...newRecent]);
      localStorage.setItem("recent_emoji", JSON.stringify(newRecent));
    }
  }

  return (
    <main className={styles.main} id="custom_scroll_2" ref={emojiPickerRef}>
      <div className={styles.list_wrapper}>
        recently used:
        {recentEmoji.map((emoji, index) => {
          return (
            <span
              key={index}
              className={styles.emoji_wrapper}
              onClick={(e) => onEmojiClickHandler(e, true)}
            >
              {emoji}
            </span>
          );
        })}
      </div>
      <RenderList
        emojiList={face_list}
        onEmojiClickHandler={onEmojiClickHandler}
      />
      <RenderList
        emojiList={animal_face_list}
        onEmojiClickHandler={onEmojiClickHandler}
      />
      <RenderList
        emojiList={emotion_list}
        onEmojiClickHandler={onEmojiClickHandler}
      />
      <RenderList
        emojiList={body_parts_list}
        onEmojiClickHandler={onEmojiClickHandler}
      />
    </main>
  );
}

export default memo(EmojiPicker);

function RenderListHandler({ emojiList, onEmojiClickHandler }: ListProps) {
  return (
    <div className={styles.list_wrapper}>
      {emojiList.map((emoji, index) => {
        return (
          <span
            key={index}
            className={styles.emoji_wrapper}
            onClick={onEmojiClickHandler}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
const RenderList = memo(RenderListHandler);

const face_list = [
  "😀",
  "😁",
  "😄",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "😐",
  "😑",
  "😶",
  "😏",
  "🙄",
  "😒",
  "😪",
  "🤤",
  "😔",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "🥴",
  "😵",
  "🤯",
  "😎",
  "🙁",
  "😮",
  "😲",
  "😳",
  "😰",
  "😭",
  "😱",
  "😖",
  "😫",
  "🥱",
  "😡",
  "😠",
  "🤬",
  "😈",
  "👿",
  "💀",
  "☠",
  "💩",
  "🤡",
  "👹",
  "👺",
  "👻",
  "👽",
  "👾",
];

const animal_face_list = [
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
];
const emotion_list = [
  "💋",
  "💌",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
  "❣",
  "💔",
  "❤️‍🔥",
  "❤️‍🩹",
  "❤",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💯",
  "💢",
  "💥",
  "💫",
  "💦",
  "💨",
  "🕳",
  "💣",
  "💬",
  "👁️‍🗨️",
  "🗨",
  "🗯",
  "💭",
  "💤",
];
const body_parts_list = [
  "👋",
  "🤚",
  "🖐",
  "✋",
  "🖖",
  "👌",
  "🤏",
  "✌",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "🖕",
  "☝",
  "👍",
  "👎",
  "✊",
  "👊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✍",
  "💅",
  "🤳",
  "💪",
  "🦾",
  "🦵",
  "🦿",
  "🦶",
  "👂",
  "🦻",
  "👃",
  "🧠",
  "👣",
  "🦷",
  "🦴",
  "👀",
  "👁",
  "👅",
];
