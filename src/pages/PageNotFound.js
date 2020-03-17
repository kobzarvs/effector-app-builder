import React from 'react'
import {CenterLayout} from '../layouts/CenterLayout'
import {Link} from 'react-router-dom'
import {Alert} from 'antd'


export const PageNotFound = ({history}) => {
  return (
    <CenterLayout>
      <Alert
        message="Error"
        description={(
          <div>
            Page not found
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault()
                  history.goBack()
                }}
              >
                Return to back
              </Link>
            </div>
          </div>
        )}
        type="error"
        showIcon
        style={{minWidth: 320, marginTop: -150 }}
      >
      </Alert>
    </CenterLayout>
  )
}

