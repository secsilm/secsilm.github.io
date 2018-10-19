---
title: 奇异值分解 SVD 的数学解释
date: 2017-03-29 12:33
tags: Machine Learning
---

奇异值分解（Singular Value Decomposition，SVD）是一种矩阵分解（Matrix Decomposition）的方法。除此之外，矩阵分解还有很多方法，例如特征分解（Eigendecomposition）、LU分解（LU decomposition）、QR分解（QR decomposition）和极分解（Polar decomposition）等。这篇文章主要说下奇异值分解，这个方法在机器学习的一些算法里占有重要地位。

<!-- more -->

---

## 相关概念

*参考自维基百科。*

- **正交矩阵**：若一个方阵其行与列皆为正交的单位向量，则该矩阵为正交矩阵，且该矩阵的转置和其逆相等。两个向量正交的意思是两个向量的内积为 0
- **正定矩阵**：如果对于所有的非零实系数向量 $z$，都有 $z^TAz>0$，则称矩阵 $A$ 是正定的。正定矩阵的行列式必然大于 0， 所有特征值也必然 > 0。相对应的，半正定矩阵的行列式必然 ≥ 0。

---

## 定义

下面引用 [SVD 在维基百科中的定义](https://en.wikipedia.org/wiki/Singular_value_decomposition)。

>In linear algebra, the **singular value decomposition** (**SVD**) is a factorization of a real or complex matrix. It is the generalization of the eigendecomposition of a positive semidefinite normal matrix (for example, a symmetric matrix with positive eigenvalues) to any $ m\times n $ matrix via an extension of polar decomposition. 

也就是说 SVD 是线代中对于实数矩阵和复数矩阵的分解，将特征分解从 *半正定矩阵* 推广到任意 $ m\times n $ 矩阵。

**注意：本篇文章内如未作说明矩阵均指实数矩阵。**

假设有 $ m\times n $ 的矩阵 $A$ ，那么 SVD 就是要找到如下式的这么一个分解，将 $A$ 分解为 3 个矩阵的乘积：

$$ A_{m \times n} = U_{m \times m}\Sigma_{m \times n} V^T_{n \times n} $$ 

其中，$U$ 和 $V$ 都是**正交矩阵** （Orthogonal Matrix），在复数域内的话就是酉矩阵（Unitary Matrix），即 

$$ U^TU = E_{m \times m}$$ 

$$ V^TV=E_{n \times n}$$

 换句话说，就是说 $U$ 的转置等于 $U$ 的逆，$V$ 的转置等于 $V$ 的逆：

$$ U^T = U^{-1}$$ 

$$ V^T = V^{-1}$$ 

而 $ \Sigma $ 就是一个非负实对角矩阵。

那么 $U$ 和 $V$ 以及 $ \Sigma $ 是如何构成的呢？

---

## 求解

$U$ 和 $V$ 的列分别叫做 $A$ 的 **左奇异向量**（left-singular vectors）和 **右奇异向量**（right-singular vectors），$ \Sigma $ 的对角线上的值叫做 $A$ 的奇异值（singular values）。

其实整个求解 SVD 的过程就是求解这 3 个矩阵的过程，而求解这 3 个矩阵的过程就是求解特征值和特征向量的过程，问题就在于 **求谁的特征值和特征向量**。

- $U$ 的列由 $AA^T$ 的单位化过的特征向量构成
- $V$ 的列由 $A^TA$ 的单位化过的特征向量构成
- $ \Sigma $ 的对角元素来源于 $AA^T$ 或 $A^TA$ 的特征值的平方根，并且是按从大到小的顺序排列的

知道了这些，那么求解 SVD 的步骤就显而易见了：

1. 求 $AA^T$ 的特征值和特征向量，用单位化的特征向量构成 $U$
2. 求 $A^TA$ 的特征值和特征向量，用单位化的特征向量构成 $V$
3. 将 $AA^T$ 或者 $A^TA$ 的特征值求平方根，然后构成 $ \Sigma $

---

## 举例

假设 

$$ A = \begin{pmatrix} 2 & 4 \\\\ 1 & 3 \\\\ 0 & 0 \\\\ 0 & 0 \\\\ \end{pmatrix}$$ 

那么可以计算得到 

$$ AA^T = \begin{pmatrix} 20 & 14 & 0 & 0 \\\\ 14 & 10 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ \end{pmatrix}$$ 

接下来就是求这个矩阵的特征值和特征向量了 

$$AA^T x = \lambda x$$ 

$$(AA^T - \lambda E)x = 0$$ 

要想该方程组有非零解（即非零特征值），那么系数矩阵 $ AA^T - \lambda E $ 的行列式必须为 0 

$$ \begin{vmatrix} 20-\lambda & 14 & 0 & 0 \\\\ 14 & 10-\lambda & 0 & 0 \\\\ 0 & 0 & -\lambda & 0 \\\\ 0 & 0 & 0 & -\lambda \\\\ \end{vmatrix} = 0 $$ 

求解这个行列式我就不再赘述了，这个直接使用行列式展开定理就可以了，可以得到 $\lambda\_1 \approx 29.86606875，\lambda\_2 \approx  0.13393125，\lambda\_3 = \lambda\_4 = 0$，有 4 个特征值，因为特征多项式 $ \vert AA^T - \lambda E \vert $ 是一个 4 次多项式。对应的单位化过的特征向量为

$$\begin{pmatrix} 0.81741556 & -0.57604844 & 0 & 0 \\\\ 0.57604844 & 0.81741556 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ \end{pmatrix}$$

这就是矩阵 $U$ 了。

同样的过程求解 $A^TA$ 的特征值和特征向量，求得 $\lambda\_1 \approx 0.13393125，\lambda\_2 \approx  29.86606875 $，将**特征值降序排列后**对应的单位化过的特征向量为

$$\begin{pmatrix} 0.40455358 & -0.9145143 \\\\ 0.9145143 & 0.40455358 \\\\ \end{pmatrix}$$

这就是矩阵 $V$ 了。

而矩阵 $\Sigma$ 根据上面说的为特征值的平方根构成的对角矩阵

$$\begin{pmatrix} 5.4649857 & 0 \\\\ 0 & 0.36596619 \\\\ 0 & 0 \\\\ 0 & 0 \\\\ \end{pmatrix}$$

到此，SVD 分解就结束了，原来的矩阵 $A$ 就被分解成了 3 个矩阵的乘积。

$$ A\_{4 \times 2} = U\_{4 \times 4}\Sigma\_{4 \times 2} V^T_{2 \times 2} $$

$$ \begin{pmatrix} 2 & 4 \\\\ 1 & 3 \\\\ 0 & 0 \\\\ 0 & 0 \\\\ \end{pmatrix} = \begin{pmatrix} 0.81741556 & -0.57604844 & 0 & 0 \\\\ 0.57604844 & 0.81741556 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ \end{pmatrix} \begin{pmatrix} 5.4649857 & 0 \\\\ 0 & 0.36596619 \\\\ 0 & 0 \\\\ 0 & 0 \\\\ \end{pmatrix} \begin{pmatrix} 0.40455358 & -0.9145143 \\\\ 0.9145143 & 0.40455358 \\\\ \end{pmatrix} ^ T $$ 

---

## Numpy 实现

Python 中可以使用 numpy 包的 `linalg.svd()` 来求解 SVD。

```python 
import numpy as np

A = np.array([[2, 4], [1, 3], [0, 0], [0, 0]])
print(np.linalg.svd(A))
```

输出
```
(array([[-0.81741556, -0.57604844,  0.        ,  0.        ],
        [-0.57604844,  0.81741556,  0.        ,  0.        ],
        [ 0.        ,  0.        ,  1.        ,  0.        ],
        [ 0.        ,  0.        ,  0.        ,  1.        ]]),
 array([ 5.4649857 ,  0.36596619]),
 array([[-0.40455358, -0.9145143 ],
        [-0.9145143 ,  0.40455358]]))
```

---

## END
