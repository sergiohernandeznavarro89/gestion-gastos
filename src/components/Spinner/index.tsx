import React, { FC } from 'react';
import { RingLoader } from 'react-spinners';
import { SpinnerOverlay } from './style';

interface Props{
    loading: boolean;
}

const Spinner: FC<Props> = ({loading}) => {
    return (        
      <SpinnerOverlay>
        <div>
          <RingLoader color="var(--blue-300)" loading={loading} size={100} />
        </div>
      </SpinnerOverlay>
    );
}

export default Spinner;