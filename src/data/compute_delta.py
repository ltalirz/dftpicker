import json
import os
from utils import calculate_delta

def compute_max_delta_values(input_json_path):
    """
    For each element in the raw.json file, compute the Delta value between each method
    and the all-electron average, then take the maximum across crystal structures.
    
    Args:
        input_json_path: Path to the input data.json file
        
    Returns:
        Dictionary with the structure data -> element -> method -> max delta value
    """
    # Load the input JSON file
    with open(input_json_path, 'r') as f:
        data = json.load(f)
    
    result = {"data": {}}
    
    # Keep track of processing statistics
    total_elements = 0
    elements_with_data = 0
    successful_calculations = 0
    
    # Process each element
    for element, element_data in data.get("data", {}).items():
        total_elements += 1
        result["data"][element] = {}
        
        # Filter for crystal structure types (those that start with X/)
        crystal_structure_types = [st for st in element_data.keys() if st.startswith("X/")]
        if not crystal_structure_types:
            print(f"No crystal structures found for {element}")
            continue
            
        elements_with_data += 1
        print(f"Processing {element} with {len(crystal_structure_types)} crystal structures")
        
        # Get all methods except "all-electron average"
        all_methods = set()
        for struct_type in crystal_structure_types:
            if struct_type in element_data and isinstance(element_data[struct_type], dict):
                methods = set(element_data[struct_type].keys())
                if "all-electron average" in methods:
                    methods.remove("all-electron average")
                all_methods.update(methods)
        
        if not all_methods:
            print(f"No methods found for {element}")
            continue
        
        print(f"Found {len(all_methods)} methods for {element}")
        
        # For each method, compute delta values compared to all-electron average
        for method in all_methods:
            delta_values = []
            
            # Check each structure for valid data for both this method and all-electron average
            for struct_type in crystal_structure_types:
                try:
                    # First, check if the basic structure for both method and all-electron average exists
                    if (struct_type in element_data and 
                        isinstance(element_data[struct_type], dict) and
                        method in element_data[struct_type] and
                        "all-electron average" in element_data[struct_type]):
                        
                        # Get method data and AE average data
                        method_data = element_data[struct_type][method]
                        ae_data = element_data[struct_type]["all-electron average"]
                        
                        # Look for Birch-Murnaghan fit data - try different possible paths
                        bm_fit_method = None
                        bm_fit_ae = None
                        
                        # Try direct path first
                        if isinstance(method_data, dict):
                            if "birch_murnaghan_fit" in method_data:
                                bm_fit_method = method_data["birch_murnaghan_fit"]
                            # Try the bm_fit_per_atom path
                            elif "bm_fit_per_atom" in method_data:
                                bm_fit_method = method_data["bm_fit_per_atom"]
                        
                        if isinstance(ae_data, dict):
                            if "birch_murnaghan_fit" in ae_data:
                                bm_fit_ae = ae_data["birch_murnaghan_fit"]
                            # Try the bm_fit_per_atom path
                            elif "bm_fit_per_atom" in ae_data:
                                bm_fit_ae = ae_data["bm_fit_per_atom"]
                        
                        # Check if we found both BM fits
                        if bm_fit_method is not None and bm_fit_ae is not None:
                            # Verify required keys exist in both fits
                            required_keys = ["min_volume", "bulk_modulus_ev_ang3", "bulk_deriv", "E0"]
                            # Check if any key is missing and try alternate keys
                            if not all(key in bm_fit_method for key in required_keys):
                                # Try mapping alternate keys
                                if "E0" not in bm_fit_method and "E0_ev" in bm_fit_method:
                                    bm_fit_method["E0"] = bm_fit_method["E0_ev"]
                                
                                # If volume is missing but lattice_constant is present
                                if "min_volume" not in bm_fit_method and "min_lattice_constant" in bm_fit_method:
                                    # This would need a proper conversion formula based on structure
                                    pass
                            
                            if not all(key in bm_fit_ae for key in required_keys):
                                # Try mapping alternate keys
                                if "E0" not in bm_fit_ae and "E0_ev" in bm_fit_ae:
                                    bm_fit_ae["E0"] = bm_fit_ae["E0_ev"]
                                
                                # If volume is missing but lattice_constant is present
                                if "min_volume" not in bm_fit_ae and "min_lattice_constant" in bm_fit_ae:
                                    # This would need a proper conversion formula based on structure
                                    pass
                            
                            if (isinstance(bm_fit_method, dict) and isinstance(bm_fit_ae, dict) and
                                all(key in bm_fit_method for key in required_keys) and
                                all(key in bm_fit_ae for key in required_keys)):
                                
                                # Verify values are numbers and not empty
                                if (all(isinstance(bm_fit_method[key], (int, float)) and str(bm_fit_method[key]) != "" for key in required_keys) and
                                    all(isinstance(bm_fit_ae[key], (int, float)) and str(bm_fit_ae[key]) != "" for key in required_keys)):
                                    
                                    # Print the values to help debug
                                    print(f"BM fit method for {element}, {method}, {struct_type}: {bm_fit_method}")
                                    print(f"BM fit AE for {element}, {method}, {struct_type}: {bm_fit_ae}")
                                    
                                    # Calculate delta between method and all-electron average
                                    delta = calculate_delta(bm_fit_method, bm_fit_ae)
                                    
                                    print(f"Delta for {element}, {method}, {struct_type} vs all-electron average: {delta}")
                                    
                                    # Check if delta is a valid number (not NaN)
                                    if delta == delta and delta is not None:  # NaN is the only value that doesn't equal itself
                                        delta_values.append(delta)
                                        print(f"Valid delta value: {delta}")
                
                except Exception as e:
                    print(f"Error calculating delta for {element}, {method}, {struct_type}: {e}")
            
            # Store the maximum delta value if there are any valid delta values
            if delta_values:
                result["data"][element][method] = max(delta_values)
                successful_calculations += 1
                print(f"Max delta for {element}, {method}: {max(delta_values)}")
            else:
                result["data"][element][method] = None
                print(f"No valid delta values for {element}, {method}")
    
    print(f"\nSummary:")
    print(f"Total elements: {total_elements}")
    print(f"Elements with crystal structure data: {elements_with_data}")
    print(f"Successful method calculations: {successful_calculations}")
    
    return result

def main():
    # Define file paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_json_path = os.path.join(script_dir, 'raw.json')
    output_json_path = os.path.join(script_dir, 'delta_values.json')
    
    # Compute the max delta values
    delta_values = compute_max_delta_values(input_json_path)
    
    # Write the results to a new JSON file
    with open(output_json_path, 'w') as f:
        json.dump(delta_values, f, indent=2)
    
    print(f"Delta values calculated and saved to {output_json_path}")

if __name__ == "__main__":
    main()
