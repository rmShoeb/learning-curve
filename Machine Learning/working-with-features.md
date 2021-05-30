# **Feature Scaling**
 * **[Feature Scaling - Why it is required?](https://rahul77349.medium.com/feature-scaling-why-it-is-required-8a93df1af310)**
 * **[When to perform feature scaling](https://www.atoti.io/when-to-perform-a-feature-scaling/)**
## **Feature Scaling Techniques**
 * **Normalization:** The point of normalization is to change your observations so that they can be described as a normal distribution. Normal distribution (Gaussian distribution), also known as the **bell curve**, is a specific statistical distribution where a roughly equal observations fall above and below the mean, the mean and the median are the same, and there are more observations closer to the mean.
	 - **Min-Max Scaling**
		 ```python
		 from sklearn.preprocessing import minmax_scale
		 ```
	- **Mean Normalization**
		```python
		from sklearn.preprocessing import Normalizer
		# or
		from scipy.stats import boxcox
		```
	- **Standardization:** also called called **z-score normalization**
		```python
		from sklearn.preprocessing import StandardScaler
		```
*  **Scaling to Unit Length**
