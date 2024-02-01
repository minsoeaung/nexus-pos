import { Alert } from 'antd';
import { ApiError } from '../types/ApiError.ts';

export const ErrorAlert = ({ error }: { error: ApiError }) => {
  return (
    <Alert
      message={error?.title || 'Something went wrong'}
      description={
        <ul>
          {error?.detail ? (
            <li>{error.detail}</li>
          ) : (
            error?.errors && (
              Object.keys(error.errors).map(key => {
                const errs = error.errors![key];
                return errs.map(e => (
                  <li>{e}</li>
                ));
              })
            )
          )}
        </ul>
      }
      type="error"
      closable
    />
  );
};