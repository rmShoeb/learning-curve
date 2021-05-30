# **Feature Scaling**
 * **[All about Feature Scaling](https://towardsdatascience.com/all-about-feature-scaling-bcc0ad75cb35)**
## **Feature Scaling Techniques**
- **Min-Max Scaling:** This Scaler scales all values in the range of [0,1], or [-1,1] if there are any negative value. It responds well if the standard deviation is small and when a distribution is not Gaussian.
	```python
	from sklearn.preprocessing import minmax_scale
	# or
	from sklearn.preprocessing import MinMaxScalar
	```
	This Scaler is sensitive to outliers. In the presence of outlier, the inliers get compressed in a narrow range.
- **Mean Normalization**
	```python
	from sklearn.preprocessing import Normalizer
	# or
	from scipy import stats
	bc, maxlog = stats.boxcox(x) # x is an ndarray to be normalized
	```
- **Standardization:** Also called called **z-score normalization**. It assumes the distribution to be normal. Scales data such that mean is 0 and standard deviation is 1.
	```python
	from sklearn.preprocessing import StandardScaler
	```
	It performs poorly if there are any outliers.
- **Maximum Absolute Scaling:** Scales each feature by its maximum absolute value. It does not shift/center any data, thus does not destroy sparsity.
	```python
	from sklearn.preprocessing import MaxAbsScaler
	```
- **Robust Scaling:** Used according to users preferance to remove outliers, removes median and scale data according to given quartile range *(default: interquartile range)*
	```python
	from sklearn.preprocessing import RobustScaler
	```
	The outliers are still in the data and transformed, but they are ignored while fitting the scaler.
- **Quantile Transformation:** Also called **Rank Scaler**.
	```python
	from sklearn.preprocessing import QuantileTransformer
	```
- **Power Transformation:** To make the data more **Gaussian-like**.
	```python
	from sklearn.preprocessing import PowerTransformer
	```
- **Unit Vector Scaling**