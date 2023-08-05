import {useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { updatePostItem } from '@redux/reducers/post/post.reducer';

export const SelectDropdown = ({ isActive, setSelectedItem, items = [] }) => {
	const dropDownRef = useRef(null);

	const dispatch = useDispatch();

	const selectItem = (item) => {
		setSelectedItem(item);
		dispatch(updatePostItem({ privacy: item.topText }));
	}

	return (
		<>
			<div className="menu-container" data-testid="menu-container">
				<nav ref={dropDownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
					<ul>
						{ items.map((item, index) => (
							<li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
								<div className="menu-icon">{item.icon}</div>
								<div className="menu-text">
									<div className="menu-text-header">{item.topText}</div>
									<div className="sub-header">{item.subText}</div>
								</div>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	);
}

SelectDropdown.propTypes = {
	isActive: PropTypes.bool,
	selectItem: PropTypes.func,
	items: PropTypes.array
};
