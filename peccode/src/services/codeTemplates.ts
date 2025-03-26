export  const getCodeTemplate = (language: string) => {
  switch (language) {
    case 'javascript':
      return `// JavaScript solution
function solution(input) {
  // Parse your input here
  
  // Write your solution logic
  
  // Return your result
  return "Your result here";
}

// Test with the provided input
console.log(solution(input));`;

    case 'python':
      return `# Python solution
def solution(input_str):
    # Parse your input here
    
    # Write your solution logic
    
    # Return your result
    return "Your result here"

# Test with the provided input
print(solution(input))`;

    case 'java':
      return `// Java solution
import java.util.*;

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input here
        
        // Write your solution logic
        
        // Print your result
        System.out.println("Your result here");
    }
}`;

    case 'cpp':
      return `// C++ solution
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Read input here
    
    // Write your solution logic
    
    // Print your result
    cout << "Your result here" << endl;
    
    return 0;
}`;

    case 'c':
      return `// C solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Read input here
    
    // Write your solution logic
    
    // Print your result
    printf("Your result here\\n");
    
    return 0;
}`;

    default:
      return `// Write your code here`;
  }
};

export const getCodeTemplate2 = (language: string, templateType: string = 'basic') => {
  const templates = {
    javascript: {
      basic: `// JavaScript Basic Template
console.log("Hello, World!");`,
      
      fizzbuzz: `// FizzBuzz Implementation
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

// Test with n = 15
fizzBuzz(15);`,
      
      strings: `// String Manipulation Example
function reverseString(str) {
  return str.split('').reverse().join('');
}

function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleanStr === reverseString(cleanStr);
}

// Test the functions
const testString = "A man, a plan, a canal: Panama";
console.log(reverseString(testString));
console.log(\`Is "\${testString}" a palindrome? \${isPalindrome(testString)}\`);`,
      
      sorting: `// Sorting Algorithm - Bubble Sort
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}

// Test with an array
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
console.log("Sorted array:", bubbleSort([...numbers]));`
    },
    
    python: {
      basic: `# Python Basic Template
print("Hello, World!")`,
      
      fizzbuzz: `# FizzBuzz Implementation
def fizz_buzz(n):
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

# Test with n = 15
fizz_buzz(15)`,
      
      strings: `# String Manipulation Example
def reverse_string(s):
    return s[::-1]

def is_palindrome(s):
    # Remove non-alphanumeric characters and convert to lowercase
    import re
    clean_str = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    return clean_str == clean_str[::-1]

# Test the functions
test_string = "A man, a plan, a canal: Panama"
print(reverse_string(test_string))
print(f'Is "{test_string}" a palindrome? {is_palindrome(test_string)}')`,
      
      sorting: `# Sorting Algorithm - Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        # Flag to optimize if no swaps occur
        swapped = False
        
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred in this pass, array is sorted
        if not swapped:
            break
    
    return arr

# Test with an array
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
print("Sorted array:", bubble_sort(numbers.copy()))`
    },
    
    c: {
      basic: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      
      fizzbuzz: `#include <stdio.h>

void fizzBuzz(int n) {
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("FizzBuzz\\n");
        } else if (i % 3 == 0) {
            printf("Fizz\\n");
        } else if (i % 5 == 0) {
            printf("Buzz\\n");
        } else {
            printf("%d\\n", i);
        }
    }
}

int main() {
    // Test with n = 15
    fizzBuzz(15);
    return 0;
}`,
      
      strings: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Function to reverse a string in-place
void reverseString(char *str) {
    int length = strlen(str);
    int i, j;
    char temp;
    
    for (i = 0, j = length - 1; i < j; i++, j--) {
        temp = str[i];
        str[i] = str[j];
        str[j] = temp;
    }
}

int main() {
    char str[100] = "Hello, World!";
    printf("Original string: %s\\n", str);
    
    reverseString(str);
    printf("Reversed string: %s\\n", str);
    
    return 0;
}`,
      
      sorting: `#include <stdio.h>

// Function to perform bubble sort
void bubbleSort(int arr[], int n) {
    int i, j, temp;
    int swapped;
    
    for (i = 0; i < n - 1; i++) {
        swapped = 0;
        
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        
        // If no swapping occurred in this pass, array is sorted
        if (swapped == 0)
            break;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    int i;
    
    printf("Original array: ");
    for (i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    bubbleSort(arr, n);
    
    printf("\\nSorted array: ");
    for (i = 0; i < n; i++)
        printf("%d ", arr[i]);
    
    return 0;
}`
    },
    
    cpp: {
      basic: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      
      fizzbuzz: `#include <iostream>
using namespace std;

void fizzBuzz(int n) {
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            cout << "FizzBuzz" << endl;
        } else if (i % 3 == 0) {
            cout << "Fizz" << endl;
        } else if (i % 5 == 0) {
            cout << "Buzz" << endl;
        } else {
            cout << i << endl;
        }
    }
}

int main() {
    // Test with n = 15
    fizzBuzz(15);
    return 0;
}`,
      
      strings: `#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>
using namespace std;

string reverseString(const string &str) {
    string reversed = str;
    reverse(reversed.begin(), reversed.end());
    return reversed;
}

bool isPalindrome(const string &str) {
    // Create a clean string (alphanumeric only, lowercase)
    string cleanStr;
    for (char c : str) {
        if (isalnum(c)) {
            cleanStr += tolower(c);
        }
    }
    
    string reversedCleanStr = cleanStr;
    reverse(reversedCleanStr.begin(), reversedCleanStr.end());
    
    return cleanStr == reversedCleanStr;
}

int main() {
    string testString = "A man, a plan, a canal: Panama";
    
    cout << "Original string: " << testString << endl;
    cout << "Reversed string: " << reverseString(testString) << endl;
    cout << "Is \\"" << testString << "\\" a palindrome? " 
         << (isPalindrome(testString) ? "Yes" : "No") << endl;
    
    return 0;
}`,
      
      sorting: `#include <iostream>
#include <vector>
using namespace std;

vector<int> bubbleSort(vector<int> arr) {
    int n = arr.size();
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, array is sorted
        if (!swapped)
            break;
    }
    
    return arr;
}

int main() {
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    
    cout << "Original array: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    vector<int> sortedNumbers = bubbleSort(numbers);
    
    cout << "Sorted array: ";
    for (int num : sortedNumbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`
    },
    
    java: {
      basic: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      
      fizzbuzz: `public class FizzBuzz {
    public static void fizzBuzz(int n) {
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
    
    public static void main(String[] args) {
        // Test with n = 15
        fizzBuzz(15);
    }
}`,
      
      strings: `public class StringManipulation {
    public static String reverseString(String str) {
        return new StringBuilder(str).reverse().toString();
    }
    
    public static boolean isPalindrome(String str) {
        // Remove non-alphanumeric characters and convert to lowercase
        String cleanStr = str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        String reversedStr = new StringBuilder(cleanStr).reverse().toString();
        return cleanStr.equals(reversedStr);
    }
    
    public static void main(String[] args) {
        String testString = "A man, a plan, a canal: Panama";
        
        System.out.println("Original string: " + testString);
        System.out.println("Reversed string: " + reverseString(testString));
        System.out.println("Is \\"" + testString + "\\" a palindrome? " + 
                          isPalindrome(testString));
    }
}`,
      
      sorting: `import java.util.Arrays;

public class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            // If no swapping occurred in this pass, array is sorted
            if (!swapped)
                break;
        }
        
        return arr;
    }
    
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original array: " + Arrays.toString(numbers));
        
        int[] sortedNumbers = bubbleSort(numbers.clone());
        
        System.out.println("Sorted array: " + Arrays.toString(sortedNumbers));
    }
}`
    }
  };
  
  // If the language doesn't exist in templates, return a default template
  if (!templates[language]) {
    return `// Write your code here for ${language}`;
  }
  
  // If the template type doesn't exist for this language, return the basic template
  return templates[language][templateType] || templates[language].basic;
};

export const getLanguageHighlightClass = (language: string) => {
  switch (language) {
    case 'javascript':
      return 'language-javascript';
    case 'python':
      return 'language-python';
    case 'java':
      return 'language-java';
    case 'cpp':
      return 'language-cpp';
    case 'c':
      return 'language-c';
    default:
      return 'language-plaintext';
  }
};
 