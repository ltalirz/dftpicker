import numpy as np
import math

def gaussian_quadrature_7pt(func, x1, x2):
    """
    Gauss-Legendre quadrature to integrate a function.
    7 points means that the result is exact for a polynomial up to a degree of 13
    
    Args:
        func: Function to integrate
        x1: Lower bound
        x2: Upper bound
        
    Returns:
        Integrated value
    """
    # gauss legendre quadrature for 7 points
    xs = np.array([
        -0.94910791, -0.74153119, -0.40584515, 0.0, 0.40584515, 0.74153119,
        0.94910791
    ])
    ws = np.array([
        0.12948497, 0.27970539, 0.38183005, 0.41795918, 0.38183005, 0.27970539,
        0.12948497
    ])

    # take into account the change of interval from [x1, x2] to [-1, 1]
    c1 = (x2 - x1) / 2
    c2 = (x1 + x2) / 2

    res = 0
    for i in range(len(xs)):
        res += c1 * ws[i] * func(c1 * xs[i] + c2)
    return res


def birch_murnaghan(v, bm_fit):
    """
    Birch-Murnaghan equation of state
    
    Args:
        v: Volume
        bm_fit: Birch-Murnaghan fit parameters
        
    Returns:
        Energy
    """
    v0 = bm_fit["min_volume"]
    b0 = bm_fit["bulk_modulus_ev_ang3"]
    b01 = bm_fit["bulk_deriv"]
    e0 = bm_fit["E0"]
    r = (v0 / v) ** (2.0 / 3.0)
    return (9.0 / 16.0) * b0 * v0 * ((r - 1.0) ** 3 * b01 + (r - 1.0) ** 2 * (6.0 - 4.0 * r))

def calculate_delta(bm_fit1, bm_fit2, debug=False):
    """
    Calculate the "original delta criterion" by Stefaan Cottenier
    using gaussian quadrature.
    
    Multiply by 1000 to convert to [meV]
    
    Args:
        bm_fit1: First Birch-Murnaghan fit parameters
        bm_fit2: Second Birch-Murnaghan fit parameters
        debug: Whether to print debug information
        
    Returns:
        Delta criterion value in meV
    """
    if bm_fit1 is None or bm_fit2 is None:
        return float('nan')

    # The integration interval is +-6% around the average min. volume,
    # as in the python implementation
    v1 = (0.94 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2
    v2 = (1.06 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2
    
    def integ(v):
        return (birch_murnaghan(v, bm_fit1) - birch_murnaghan(v, bm_fit2)) ** 2
    
    res = gaussian_quadrature_7pt(integ, v1, v2)
    delta = 1000 * math.sqrt(res / (v2 - v1))

    if debug:
        print(bm_fit1, bm_fit2, delta)

    return delta
