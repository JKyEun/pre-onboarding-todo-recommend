export type RecommendDropdownProps = {
  inputText: string;
  recommendations: string[];
  setRecommendations: React.Dispatch<React.SetStateAction<string[]>>;
  handleRecommendationClick: (el: string) => void;
};
