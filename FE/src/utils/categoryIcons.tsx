import React from 'react';
import {
  AppstoreOutlined,
  CloudOutlined,
  DashboardOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  InboxOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const CATEGORY_ICON_BY_KEY: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  inbox: InboxOutlined,
  sync: SyncOutlined,
  cloud: CloudOutlined,
  experiment: ExperimentOutlined,
  thunderbolt: ThunderboltOutlined,
  tool: ToolOutlined,
  desktop: DesktopOutlined,
  dashboard: DashboardOutlined,
};

const CATEGORY_ICON_BY_ID: Record<number, React.ComponentType<{ style?: React.CSSProperties }>> = {
  1: InboxOutlined,
  2: SyncOutlined,
  3: CloudOutlined,
  4: ExperimentOutlined,
  5: ThunderboltOutlined,
  6: ToolOutlined,
  7: DesktopOutlined,
  8: DashboardOutlined,
};

export const getCategoryIcon = (
  category: { id?: number; icon?: string },
  style?: React.CSSProperties,
): React.ReactNode => {
  const byKey = category.icon ? CATEGORY_ICON_BY_KEY[category.icon] : undefined;
  const Icon = byKey || (category.id ? CATEGORY_ICON_BY_ID[category.id] : undefined) || AppstoreOutlined;
  return <Icon style={style} />;
};
