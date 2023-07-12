import img from "./error.gif";

const ErrorMessage = () => {
  return (
    <img
      src={img}
      alt="Error message"
      style={{
        display: "block",
        width: "250px",
        objectFit: "contain",
        margin: "0 auto",
      }}
    />
  );
};

export default ErrorMessage;
