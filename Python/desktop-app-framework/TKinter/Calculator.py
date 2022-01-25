from tkinter import *


def print_number(x):
    if entry_box.get() == '0':
        entry_box.delete(0, END)
        entry_box.insert(0, str(x))
    else:
        length = len(entry_box.get())
        entry_box.insert(length, str(x))


def print_operator(operator_button_index):
    content = entry_box.get()
    length = len(content)
    if content[length-1] in operators:
        return
    entry_box.insert(length, operator_buttons[operator_button_index]['text'])
    # entry_box.insert(length, operators[operator_button_index])


def print_dot_operator():
    content = entry_box.get()
    if "." not in content:
        entry_box.insert(len(content), ".")


def clear_entry_box():
    entry_box.delete(0, END)
    entry_box.insert(0, '0')


def delete_one_entry():
    length = len(entry_box.get())
    entry_box.delete(length - 1, END)
    if length is 1:
        entry_box.insert(0, "0")


history = []


def evaluate_expression():
    content = entry_box.get()
    history.append(content)
    result = eval(content)  # eval() returns in integer or float
    entry_box.delete(0, END)
    entry_box.insert(0, result)  # looks like insert() can take integers too!
    status.configure(text="History: " + " \n ".join(history[-4:]))


# main frame
main_frame = Tk()
main_frame.title("Calculator")
main_frame.geometry("380x550+100+50")
main_frame.resizable(False, False)

# display
entry_box = Entry(font="verdana 16 bold", width=27, bd=6, justify=RIGHT)
entry_box.insert(0, '0')
entry_box.place(x=20, y=20)

# answer button
answer_button = Button(text='Ans', width=4, bd=3, command=evaluate_expression)
answer_button.place(x=25, y=70)

# clearing options
delete_button = Button(text="del", width=4, bd=3, command=delete_one_entry)
delete_button.place(x=205, y=70)
clear_button = Button(text="AC", width=4, bd=3, command=clear_entry_box)
clear_button.place(x=295, y=70)

# number buttons
number_buttons = []
for number in range(10):
    number_buttons.append(Button(text=str(number), width=4, bd=3,
                                 command=lambda x=number: print_number(x)))
number = 9
for row in range(3):
    for column in range(3):
        number_buttons[number].place(x=25 + column * 90, y=140 + row * 70)
        number = number - 1
number_buttons[0].place(x=25, y=350)

# operator buttons
operator_buttons = []
operators = ['+', '-', '*', '/']
for i in range(4):
    operator_buttons.append(Button(text=operators[i], width=4, bd=3,
                                   command=lambda x=i: print_operator(x)))
    operator_buttons[i].place(x=295, y=140 + i * 70)

# dot operator
dot_operator_button = Button(text=".", width=4, bd=3, command=print_dot_operator)
dot_operator_button.place(x=115, y=350)

# history
status = Label(main_frame, text="History", anchor=W, relief=SUNKEN)
status.pack(side=BOTTOM, fill=X)

main_frame.mainloop()
