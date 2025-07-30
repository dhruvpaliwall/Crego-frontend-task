// accountNode.js

import { Handle, Position } from "reactflow";
import BaseNode from "./baseNode";
import { useStore } from "../store";
import { IconUserDollar } from "@tabler/icons-react";

export const AccountNode = ({ id }) => {
  const { setCurrentSelectId, currentSelectId } = useStore();

  return (
    <BaseNode
      title="Account"
      icon={<IconUserDollar stroke={2} size={20} />}
      isSelected={currentSelectId === id}
      onClick={() => setCurrentSelectId(id)}
      handles={[{ type: "source", position: Position.Right, id: `${id}-out` }]}
    />
  );
};
