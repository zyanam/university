﻿namespace iipy2
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.button1 = new System.Windows.Forms.Button();
            this.listBox1 = new System.Windows.Forms.ListBox();
            this.infoGroupBox = new System.Windows.Forms.GroupBox();
            this.textName = new System.Windows.Forms.TextBox();
            this.textFileType = new System.Windows.Forms.TextBox();
            this.textVolumeLabel = new System.Windows.Forms.TextBox();
            this.textFileSystem = new System.Windows.Forms.TextBox();
            this.textTotal = new System.Windows.Forms.TextBox();
            this.textFreeSpace = new System.Windows.Forms.TextBox();
            this.infoGroupBox.SuspendLayout();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(12, 12);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(157, 47);
            this.button1.TabIndex = 0;
            this.button1.Text = "button1";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // listBox1
            // 
            this.listBox1.FormattingEnabled = true;
            this.listBox1.Items.AddRange(new object[] {
            "asd",
            "as1"});
            this.listBox1.Location = new System.Drawing.Point(12, 65);
            this.listBox1.Name = "listBox1";
            this.listBox1.Size = new System.Drawing.Size(157, 108);
            this.listBox1.TabIndex = 1;
            this.listBox1.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
            // 
            // infoGroupBox
            // 
            this.infoGroupBox.Controls.Add(this.textFreeSpace);
            this.infoGroupBox.Controls.Add(this.textTotal);
            this.infoGroupBox.Controls.Add(this.textFileSystem);
            this.infoGroupBox.Controls.Add(this.textVolumeLabel);
            this.infoGroupBox.Controls.Add(this.textFileType);
            this.infoGroupBox.Controls.Add(this.textName);
            this.infoGroupBox.Location = new System.Drawing.Point(233, 65);
            this.infoGroupBox.Name = "infoGroupBox";
            this.infoGroupBox.Size = new System.Drawing.Size(480, 293);
            this.infoGroupBox.TabIndex = 2;
            this.infoGroupBox.TabStop = false;
            this.infoGroupBox.Text = "groupBox1";
            // 
            // textName
            // 
            this.textName.BackColor = System.Drawing.Color.White;
            this.textName.Location = new System.Drawing.Point(23, 20);
            this.textName.Name = "textName";
            this.textName.Size = new System.Drawing.Size(275, 20);
            this.textName.TabIndex = 0;
            this.textName.Text = "sfdsd";
            this.textName.TextChanged += new System.EventHandler(this.textBox1_TextChanged);
            // 
            // textFileType
            // 
            this.textFileType.Location = new System.Drawing.Point(23, 55);
            this.textFileType.Name = "textFileType";
            this.textFileType.Size = new System.Drawing.Size(275, 20);
            this.textFileType.TabIndex = 1;
            // 
            // textVolumeLabel
            // 
            this.textVolumeLabel.Location = new System.Drawing.Point(23, 88);
            this.textVolumeLabel.Name = "textVolumeLabel";
            this.textVolumeLabel.Size = new System.Drawing.Size(275, 20);
            this.textVolumeLabel.TabIndex = 2;
            // 
            // textFileSystem
            // 
            this.textFileSystem.Location = new System.Drawing.Point(23, 123);
            this.textFileSystem.Name = "textFileSystem";
            this.textFileSystem.Size = new System.Drawing.Size(275, 20);
            this.textFileSystem.TabIndex = 3;
            // 
            // textTotal
            // 
            this.textTotal.Location = new System.Drawing.Point(23, 158);
            this.textTotal.Name = "textTotal";
            this.textTotal.Size = new System.Drawing.Size(275, 20);
            this.textTotal.TabIndex = 4;
            // 
            // textFreeSpace
            // 
            this.textFreeSpace.Location = new System.Drawing.Point(23, 196);
            this.textFreeSpace.Name = "textFreeSpace";
            this.textFreeSpace.Size = new System.Drawing.Size(275, 20);
            this.textFreeSpace.TabIndex = 5;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(725, 370);
            this.Controls.Add(this.infoGroupBox);
            this.Controls.Add(this.listBox1);
            this.Controls.Add(this.button1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.infoGroupBox.ResumeLayout(false);
            this.infoGroupBox.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ListBox listBox1;
        private System.Windows.Forms.GroupBox infoGroupBox;
        private System.Windows.Forms.TextBox textName;
        private System.Windows.Forms.TextBox textTotal;
        private System.Windows.Forms.TextBox textFileSystem;
        private System.Windows.Forms.TextBox textVolumeLabel;
        private System.Windows.Forms.TextBox textFileType;
        private System.Windows.Forms.TextBox textFreeSpace;
    }
}

