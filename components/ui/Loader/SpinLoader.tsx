type SpinLoaderProps = {
  size?: number;
};

function SpinLoader({ size = 40 }: SpinLoaderProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="mx-auto animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
    />
  );
}

export default SpinLoader;
