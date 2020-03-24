import React from 'react'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  DropboxOutlined,
  EyeOutlined,
  FileMarkdownOutlined,
  FolderOutlined,
  FunctionOutlined,
  LinkOutlined,
  NodeExpandOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {unitColors} from './unitColors'


export const UnitIcon = ({unit = 'model', color, style = {}}) => {
  style.color = color === undefined ? unitColors[unit] : color === false ? undefined : color

  return {
    model: <FileMarkdownOutlined style={style} />,
    domain: <ApartmentOutlined style={style} />,
    stores: <FolderOutlined style={style} />,
    store: <DropboxOutlined style={style} />,
    combine: <AppstoreOutlined style={style} />,
    map: <AppstoreOutlined style={style} />,
    restore: <AppstoreOutlined style={style} />,
    events: <FolderOutlined style={style} />,
    event: <ThunderboltOutlined style={style} />,
    effects: <FolderOutlined style={style} />,
    effect: <FunctionOutlined style={style} />,
    processes: <FolderOutlined style={style} />,
    process: <NodeExpandOutlined style={style} />,
    root: <FolderOutlined style={style} />,
    sample: <ThunderboltOutlined style={style} />,
    watch: <EyeOutlined style={style} />,
    on: <ThunderboltOutlined style={style} />,
    deps: <LinkOutlined style={style} />,
    function: <PlayCircleOutlined style={style} />,
  }[unit]
}
