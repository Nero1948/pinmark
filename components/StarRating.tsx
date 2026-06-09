type StarRatingProps = {
  stars: 0 | 1 | 2 | 3;
  size?: "sm" | "md" | "lg";
};

export function StarRating({ stars, size = "md" }: StarRatingProps) {
  return (
    <span className={`pm-stars pm-stars--${size}`} aria-label={`${stars} out of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < stars ? "pm-star pm-star--on" : "pm-star pm-star--off"}>
          ★
        </span>
      ))}
    </span>
  );
}
