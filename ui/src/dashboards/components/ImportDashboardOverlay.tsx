// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {withRouter, WithRouterProps} from 'react-router'

// Constants
import {dashboardImportFailed} from 'src/shared/copy/notifications'

// Actions
import {notify as notifyAction} from 'src/shared/actions/notifications'
import {getDashboardsAsync} from 'src/dashboards/actions/v2'

// Types
import ImportOverlay from 'src/shared/components/ImportOverlay'
import {createDashboardFromTemplate as createDashboardFromTemplateAction} from 'src/dashboards/actions/v2'

interface OwnProps {
  orgID: string
}
interface DispatchProps {
  notify: typeof notifyAction
  createDashboardFromTemplate: typeof createDashboardFromTemplateAction
  populateDashboards: typeof getDashboardsAsync
}

type Props = OwnProps & DispatchProps & WithRouterProps

class ImportDashboardOverlay extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    return (
      <ImportOverlay
        onDismissOverlay={this.handleDismissOverlay}
        resourceName="Dashboard"
        onSubmit={this.handleUploadDashboard}
      />
    )
  }

  private handleUploadDashboard = async (
    uploadContent: string
  ): Promise<void> => {
    const {
      notify,
      createDashboardFromTemplate,
      populateDashboards,
      orgID,
    } = this.props

    try {
      const template = JSON.parse(uploadContent)

      if (_.isEmpty(template)) {
        this.handleDismissOverlay()
        return
      }

      await createDashboardFromTemplate(template, orgID)
      await populateDashboards()
      this.handleDismissOverlay()
    } catch (error) {
      notify(dashboardImportFailed(error))
    }
  }

  private handleDismissOverlay = () => {
    this.props.router.goBack()
  }
}

const mdtp: DispatchProps = {
  notify: notifyAction,
  createDashboardFromTemplate: createDashboardFromTemplateAction,
  populateDashboards: getDashboardsAsync,
}

export default connect<{}, DispatchProps, OwnProps>(
  null,
  mdtp
)(withRouter(ImportDashboardOverlay))
