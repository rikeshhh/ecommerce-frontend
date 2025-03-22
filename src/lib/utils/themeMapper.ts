export const mapThemeToStyles = (theme: string) => {
  switch (theme) {
    case "Red":
      return {
        gradient: "from-red-500 to-red-700",
        textColor: "text-red-700",
        hoverBg: "hover:bg-red-100",
      };
    case "Orange":
      return {
        gradient: "from-orange-500 to-orange-700",
        textColor: "text-orange-700",
        hoverBg: "hover:bg-orange-100",
      };
    case "Indigo":
    default:
      return {
        gradient: "from-indigo-500 to-indigo-700",
        textColor: "text-indigo-700",
        hoverBg: "hover:bg-indigo-100",
      };
  }
};
