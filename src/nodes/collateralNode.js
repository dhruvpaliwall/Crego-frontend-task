// collateralNode.js

import {Position } from 'reactflow';
import BaseNode from './baseNode';
import { useStore } from '../store';
import { IconBuildingBank } from '@tabler/icons-react';

export const CollateralNode = ({ id, data }) => {
  const { setCurrentSelectId, currentSelectId } = useStore();

  return (
    <BaseNode
      title="Collateral"
      icon={<IconBuildingBank stroke={2} size={20} />}
      isSelected={currentSelectId === id}
      onClick={() => setCurrentSelectId(id)}
      handles={[{ type: 'target', position: Position.Left, id: `${id}-in` }]}
    >
    </BaseNode>
  );
};
