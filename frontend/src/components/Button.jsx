const Button = ({ text, onClick, type, variant, loading, disabled }) => {
  return (
    <button
      type={type || 'button'}
      className={`btn btn-${variant || 'primary'} w-100`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
          />
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;