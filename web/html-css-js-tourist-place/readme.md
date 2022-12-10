**Fixes**

1. Rating and Image validation fixed
2. Image preview added for "Update"
3. Clicking "Reset" while updating information will reset the form back to "Add new Place"

**Assignment - Solution**

1. Initially, the ```Places``` list is empty. There are some images in the ```img``` folder to populate it.

  

2. Once there are some items in the list, they can be searched from the ```Search Place Name``` input. The list will show the result as you type. The search is case insensitive and starts from the beginning of the string.

3. The ```Name```, ```Address``` and ```Rating``` columns have sorting events. Click on them to sort the list. First click will sort in ascending order, and the second click will sort in descending order, and so on.

4. For saving the images, I have found ```URL.createObjectURL()``` to be better than ```FileReader.readAsDataURL()``` for this assignment.