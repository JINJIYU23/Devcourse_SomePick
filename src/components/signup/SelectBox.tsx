import Select from "react-select";
import { optionsGroup } from "../../constants/data/optionsData";

interface SelectBoxProps {
  type: "job" | "location" | "mbti";
  value: string;
  onChange: (value: string) => void;
}

export default function SelectBox({ type, value, onChange }: SelectBoxProps) {
  const isDarkMode = document.documentElement.classList.contains("dark");
  const options = optionsGroup[type];
  const selectedOption = options.find((option) => option.value === value);

  const titleGroup = {
    job: "직업",
    location: "사는 지역",
    mbti: "MBTI",
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <p className="ml-5 mb-1">*{titleGroup[type]}</p>

        <Select
          options={options}
          isSearchable={false}
          placeholder="선택"
          value={selectedOption}
          onChange={(option) => option && onChange(option.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderRadius: "100px",
              width: "220px",
              height: "50px",
              paddingRight: "10px",
              paddingLeft: "10px",
              cursor: "pointer",
              borderColor: state.isFocused
                ? "var(--primary-pink-tone)"
                : "var(--primary-pink)",
              boxShadow: state.isFocused
                ? "0 0 10px var(--primary-pink-tone)"
                : "none",
              "&:hover": {
                borderColor: "var(--primary-pink)",
              },
              backgroundColor: isDarkMode ? "var( --dark-bg-secondary)" : "",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: "var(--primary-pink)",
              "&:hover": {
                color: "var(--primary-pink)",
              },
            }),
            menu: (base) => ({
              ...base,
              border: "1px solid var(--primary-pink)",
              borderRadius: "10px",
              overflow: "hidden",
            }),
            menuList: (base) => ({
              ...base,
              padding: 0,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
            option: (base, state) => ({
              ...base,
              cursor: "pointer",
              backgroundColor: state.isSelected
                ? "var(--primary-pink)"
                : state.isFocused
                ? isDarkMode
                  ? "var(--gray-500)"
                  : "var(--gray-300-50)"
                : isDarkMode
                ? "var(--dark-bg-secondary)"
                : "white",
              color: isDarkMode ? "white" : "black",
              paddingLeft: "20px",
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
            placeholder: (base) => ({
              ...base,
              color: isDarkMode ? "var(--dark-white)" : "",
            }),
            singleValue: (base) => ({
              ...base,
              color: isDarkMode ? "var(--dark-white)" : "",
            }),
          }}
        />
      </div>
    </>
  );
}
