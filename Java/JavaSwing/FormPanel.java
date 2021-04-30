import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.DefaultComboBoxModel;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;

public class FormPanel extends JPanel{
	private static final long serialVersionUID = 1L;
	
	private JLabel 			nameLabel;
	private JLabel 			occupationLabel;
	private JLabel 			listLabel;
	private JTextField 		nameField;
	private JTextField 		occupationField;
	private JButton 		submit;
	private FormListener 	formListener;
	private JList 			ageList;
	private JComboBox		employment;

	public FormPanel() {
		Dimension dimension = getPreferredSize();

		nameLabel			= new JLabel("Name: ");
		occupationLabel 	= new JLabel("Occupation: ");
		listLabel			= new JLabel("Age: ");
		nameField 			= new JTextField(10);
		occupationField 	= new JTextField(10);
		submit 				= new JButton("Submit");
		ageList 			= new JList();
		employment			= new JComboBox();
		GridBagConstraints 	gbc 		= new GridBagConstraints();
		DefaultListModel 	ageModel 	= new DefaultListModel();
		
//////////setup list model///////////////////////////
		ageModel.addElement(new AgeCategory(0, "Under 18"));
		ageModel.addElement(new AgeCategory(1, "18 to 65"));
		ageModel.addElement(new AgeCategory(2, "Over 65"));
		ageList.setModel(ageModel);
		ageList.setPreferredSize(new Dimension(100, 50));
		ageList.setBorder(BorderFactory.createEtchedBorder());
		ageList.setSelectedIndex(0);
		
///////////setup combobox model/////////////////////
		DefaultComboBoxModel employmentModel = new DefaultComboBoxModel();
		employmentModel.addElement("Employed");
		employmentModel.addElement("Unemployed");
		employmentModel.addElement("Self-employed");
		employment.setModel(employmentModel);
		
//////////setup form dimension/////////////////////////////////////
		dimension.width = 250;
		setPreferredSize(dimension);
		
		Border innerBorder = BorderFactory.createTitledBorder("Information");
		Border outerBorder = BorderFactory.createEmptyBorder(10, 10, 10, 10);
		setBorder(BorderFactory.createCompoundBorder(outerBorder, innerBorder));
		
		setLayout(new GridBagLayout());
		
		gbc.weightx = 1;
		gbc.weighty = 0.1;
		gbc.fill = GridBagConstraints.NONE;
		
//////////////////first row///////////////////////////////
		gbc.gridx = 0;
		gbc.gridy = 0;
		gbc.anchor = GridBagConstraints.LINE_END;
		gbc.insets = new Insets(0, 0, 0, 0);
		add(nameLabel, gbc);
		
		gbc.gridx = 1;
//		gbc.gridy = 0;
		gbc.anchor = GridBagConstraints.LINE_START;
//		gbc.insets = new Insets(0, 0, 0, 0);
		add(nameField, gbc);
		
/////////second row/////////////////////////////////
		gbc.gridx = 0;
		gbc.gridy = 1;
		gbc.anchor = GridBagConstraints.LINE_END;
//		gbc.insets = new Insets(0, 0, 0, 5);
		add(occupationLabel, gbc);
		
		gbc.gridx = 1;
//		gbc.gridy = 1;
		gbc.anchor = GridBagConstraints.LINE_START;
//		gbc.insets = new Insets(0, 0, 0, 0);
		add(occupationField, gbc);
		
/////////////////third row///////////////////////////
		gbc.gridx = 0;
		gbc.gridy = 2;
		gbc.anchor = GridBagConstraints.LINE_END;
		gbc.insets = new Insets(0, 0, 0, 0);
		add(listLabel, gbc);
		
		gbc.gridx = 1;
//		gbc.gridy = 2;
		gbc.anchor = GridBagConstraints.FIRST_LINE_START;
//		gbc.insets = new Insets(0, 0, 0, 0);
		add(ageList, gbc);
		
////////////////last row//////////submit//////////////////
		gbc.weighty = 1.5;
//		gbc.gridx = 1;
		gbc.gridy = 3;
		gbc.anchor = GridBagConstraints.FIRST_LINE_START;
//		gbc.insets = new Insets(0, 0, 0, 0);
		add(submit, gbc);
		
		submit.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				String name = nameField.getText();
				String occupation = occupationField.getText();
				String age = (String)ageList.getSelectedValue();
				// AgeCategory age = (AgeCategory)ageList.getSelectedValue();
				
				FormEvent formEvent = new FormEvent(this, name, occupation, age);
				
				if(formEvent != null) {
					formListener.formEventOccured(formEvent);
				}
			}
			
		});
	}
	
	public void setFormListener(FormListener listener) {
		this.formListener = listener;
	}
}

class AgeCategory{
	private int age;
	private String text;
	
	public AgeCategory(int age, String text) {
		this.age = age;
		this.text = text;
	}
	
	public String toString() {
		return text;
	}
	
	public int getAge() {
		return age;
	}
}