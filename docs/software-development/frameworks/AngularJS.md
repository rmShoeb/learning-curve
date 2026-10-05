# AngularJS

# Directive

## Predefined Directives

```js
ng-app ng-controller
ng-include="'myFile.htm'"
ng init ng-model ng-bind
ng-click ng-change
ng-if ng-show ng-hide
ng-repeat
- $index
- $first
- $middle
- $last
```

## Create New Directives

```js
// creating directives
app.directive("NewDirective", function(){
return {
restrict : "A",
template : "<h1>Made by a directive!</h1>"
};
});
```

```html
<!-- using directives -->
<new-directive></new-directive> <!-- Element name -->
<div new-directive></div> // Attribute
<div class="new-directive"></div> <!-- Class -->
<!-- directive: new-directive -->
```

The `restrict` attribute restricts the directive to specific HTML methods.
• `E` for Element name
• `A` for Attribute
• `C` for Class
• `M` for Comment
The default value is `EA`.


# Resources
* [AngularJS Tutorial](https://www.w3schools.com/angular/default.asp)
* [Thinking in Angular 1 - YouTube](https://www.youtube.com/playlist?list=PLqq-6Pq4lTTbWLgk2YspgXA_xORzD0Ax6)