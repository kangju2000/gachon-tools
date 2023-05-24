interface ActivityTagProps {
  type: 'assignment' | 'video';
}
const ActivityTag = ({ type }: ActivityTagProps) => {
  const status = {
    assignment: {
      color: 'bg-[#2F6EA2]',
      text: '과제',
    },
    video: {
      color: 'bg-black',
      text: '녹화강의',
    },
  }[type];

  return (
    <span
      className={`absolute -top-8 rounded-full px-2 py-1 text-[6px] text-white ${status.color}`}
    >
      {status.text}
    </span>
  );
};

export default ActivityTag;
