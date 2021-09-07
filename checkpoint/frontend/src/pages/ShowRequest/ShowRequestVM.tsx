import * as React from 'react';
import { AppState } from '../../redux/state';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import ShowRequest from './ShowRequest';
import { useParams } from 'react-router-dom';
import { fetchRequestDetails, clearRequestDetails, fetchRequests } from 'redux/actions/appActions';

const mapState = (state: AppState) => {
  return {
    requests: state.app.requests,
    details: state.app.details,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, AnyAction>) => {
  return {
    fetchRequestDetails: (request_id: number) => dispatch(fetchRequestDetails(request_id)),
    clearRequestDetails: () => dispatch(clearRequestDetails()),
    fetchRequests: () => dispatch(fetchRequests()),
  };
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

interface Params {
  request_id?: string;
}

const ShowRequestVM: React.FC<Props> = ({
  requests,
  details,
  fetchRequests,
  fetchRequestDetails,
  clearRequestDetails,
}) => {
  const { request_id } = useParams<Params>();
  let rid: number | undefined = undefined;
  if (request_id) {
    rid = parseInt(request_id);
  }
  React.useEffect(() => {
    clearRequestDetails();
    fetchRequests();
    if (rid) {
      fetchRequestDetails(rid);
    }
  }, []);
  const request = requests?.find((request) => request.id == rid);

  return <ShowRequest request_id={request_id} request={request} details={details} />;
};

const ConnectedViewModel = connector(ShowRequestVM);

export default ConnectedViewModel;
