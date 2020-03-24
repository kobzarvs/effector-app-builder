import {Col, Row, Statistic} from 'antd'
import {pathOr} from 'ramda'
import React from 'react'


export const Metrics = ({ groups }) => (
  <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, background: 'white'}}>
    <Row gutter={16} style={{marginBottom: 20}}>
      <Col span={8}>
        <Statistic title="Models" value={pathOr(0, ['model', 'length'], groups)} />
      </Col>
      <Col span={8}>
        <Statistic title="Functions" value={pathOr(0, ['function', 'length'], groups)} />
      </Col>
      <Col span={8}>
        <Statistic title="Domains" value={pathOr(0, ['domain', 'length'], groups)} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Events" value={pathOr(0, ['event', 'length'], groups)} />
      </Col>
      <Col span={8}>
        <Statistic title="Effects" value={pathOr(0, ['effect', 'length'], groups)} />
      </Col>
      <Col span={8}>
        <Statistic title="Stores" value={pathOr(0, ['store', 'length'], groups)} />
      </Col>
    </Row>
  </div>
)
