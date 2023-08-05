import PropTypes from 'prop-types';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';
import { UtilsService } from '@services/utils/utils.service';

export const Toast = (props) => {
	const { toastList, position, autoDelete, autoDeleteTime = 2000 } = props;
	const [ list, setList ] = useState(toastList);
	const listData = useRef([]);

	const dispatch = useDispatch();

	const deleteToast = useCallback((index) => {
		listData.current = cloneDeep(list);
		index = index === -1 ? 0 : index;
		listData.current.splice(index, 1);

		setList([...listData.current]);

		if (!listData.current.length) {
			list.length = 0;
			UtilsService.dispatchClearNotification(dispatch);
		}
	}, [list, dispatch]);

	useEffect(() => {
		setList([...toastList]);
	}, [toastList]);

	useEffect(() => {
		const tick = () => {
			deleteToast(-1);
		}

		if (autoDelete && autoDeleteTime && toastList.length && list.length) {
			const interval = setInterval(tick, autoDeleteTime);
			return () => clearInterval(interval);
		}
	}, [autoDelete, autoDeleteTime, deleteToast, toastList, list]);

	return (
		<>
			<div className={`toast-notification-container ${position}`}>
				{list?.map((toast, index) => (
					<div
						data-testid={"toast-notification"}
						key={index}
						className={`toast-notification toast ${position}`}
						style={{ backgroundColor: toast.backgroundColor }}
					>
						<button className={"cancel-button"} onClick={() => deleteToast(index)}>X</button>

						<div className={`toast-notification-image ${toast?.description.length <= 73 ? 'toast-icon' : ''}`}>
							<img src={toast.icon} alt="Icon"/>
						</div>

						<div className={`toast-notification-message ${toast?.description.length <= 73 ? 'toast-message' : ''}`}>
							{toast.description}
						</div>
					</div>
				))}
			</div>
		</>
	);
}

Toast.propTypes = {
	toastList: PropTypes.array,
	position: PropTypes.string,
	autoDelete: PropTypes.bool,
	autoDeleteTime: PropTypes.number
};