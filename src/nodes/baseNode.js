import { Handle, Position } from 'reactflow';


const BaseNode = ({
    title,
    children,
    handles = [],
    isSelected = false,
    onClick,
}) => {
    const renderHandles = () => {
        return handles.map((handle, index) => (
            <Handle
                key={`${handle.id || index}`}
                type={handle.type || 'source'}
                position={handle.position || Position.Right}
                id={handle.id || `handle-${index}`}
                style={handle.style || {}}
            />
        ));
    };

    return (
        <div    className={`
                flex flex-col
                max-w-[200px] min-w-[250px]
                rounded
                shadow-lg
                ${isSelected ? 'border-2 border-[rgba(142,142,171,255)]' : ''}
            `} onClick={onClick}>
            <div className="
                inline-flex
                justify-between
                items-center
                p-1.5
                font-bold
                text-lg
                rounded
                bg-[#b4efe6]
            ">
                {title}
            </div>
           <div className="p-3">
                {children}
            </div>
            {renderHandles()}
        </div>
    );
};

export default BaseNode;