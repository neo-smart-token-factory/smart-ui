

const SkeletonLoader = ({ variant = 'text', width = 'w-full', height = 'h-4', className = '' }) => {
    const variants = {
        text: 'rounded',
        circle: 'rounded-full',
        rect: 'rounded-xl',
    };

    return (
        <div
            className={`skeleton ${variants[variant] || variants.text} ${width} ${height} ${className}`}
        />
    );
};

export default SkeletonLoader;
