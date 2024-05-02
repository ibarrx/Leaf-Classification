import torch
import torch.nn as nn
from torch.autograd import Variable
from torch.utils.data import Dataset
from torchvision import datasets
import torchvision.transforms as transforms
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import pickle
import os
from custom_dataset import CustomDataset

# design cnn architecture / load pree-trained model
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        '''
        Goes through two layers of 2D convolutions, each followed by a 2x2 max pooling
        
        Dimensions:
        1.) Input Shape:          [batch_size, 3, 256, 256]
        
        2.) After conv:           [batch_size, 6, 254, 254]
            After max pooling:    [batch_size, 6, 127, 127]
        
        3.) After conv:           [batch_size, 12, 125, 125]
            After max pooling:    [batch_size, 12, 62, 62]
            
        4.) After flattening:     [batch_size, 12 * 62 * 62]
        '''
        
        self.conv1 = nn.Sequential(         
            nn.Conv2d(
                in_channels=3,              
                out_channels=6,            
                kernel_size=3,              
                stride=1,                   
                padding=0,                  
            ),                              
            nn.ReLU(),                      
            nn.MaxPool2d(kernel_size=2),    
        )
        self.conv2 = nn.Sequential(         
            nn.Conv2d(6, 12, 3, 1, 0),     
            nn.ReLU(),                      
            nn.MaxPool2d(2),                
        )
        # fully connected layer, output 10 classes
        self.out = nn.Linear(12 * 62 * 62, 10)
        
    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        # flatten the output of conv2 to (batch_size, 16 * 8 * 8)
        x = x.view(x.size(0), -1)       
        output = self.out(x)
        return output, x    # return x for visualization



def validate(cnn, loader):
    cnn.eval()
        
    # evaluate the model
    correct = 0
    total = 0
    total_loss = 0
    with torch.no_grad():
        for images, labels in loaders['test']:
            images = images.float() / 255.0  # Normalize images
            labels = labels.long()  # Convert labels to the appropriate data type
            
            outputs, _ = cnn(images)
            loss = loss_func(outputs, labels)
            total_loss += loss.item()
            
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    val_accuracy = correct / total
    val_loss = total_loss / len(loader)
    return val_accuracy, val_loss


def train(num_epochs, cnn, loaders):
    cnn.train()
        
    # Train the model
    total_step = len(loaders['train'])
    print("INITIATING TRAINING...")
    for epoch in range(num_epochs):
        acc_array = []
        loss_array = []
        for i, (images, labels) in enumerate(loaders['train']):
            # convert images and labels into float tensors and normalize
            images = images.float() / 255.0
            labels = labels.long()
            
            # gives batch data, normalize x when iterate train_loader
            b_x = Variable(images)   # batch x
            b_y = Variable(labels)   # batch y
            output = cnn(b_x)[0]               
            loss = loss_func(output, b_y)
            
            # measure accuracy and record loss
            train_output, _ = cnn(images)
            pred_y = torch.max(train_output, 1)[1].data.squeeze()
            accuracy = (pred_y == labels).sum().item() / float(labels.size(0))
            

            # clear gradients for this training step   
            optimizer.zero_grad()
            
            # backpropagation, compute gradients 
            loss.backward()
            
            # apply gradients             
            optimizer.step()  
            
            # validate model
            val_accuracy, val_loss = validate(cnn, loaders['test'])
            
            # storing results
            acc_array.append(accuracy)
            loss_array.append(loss.item())
            val_acc_data.append(val_accuracy)
            val_loss_data.append(val_loss)
            epochs_arr.append((i+1) / total_step)
            
            if (i+1) % 25 == 0 or (i+1) == total_step:
                print ('Epoch [{}/{}], Step [{}/{}], Loss: {:.4f}, Accuracy: {:.4f}, Validation Accuracy: {:.4f}, Validation Loss: {:.4f}' 
                       .format(epoch + 1, num_epochs, i + 1, total_step, loss.item(), accuracy, val_accuracy, val_loss))
                
                
            
#             if (i+1) % 600 == 0:
#                 train_acc_data.append(accuracy)
#                 loss_data.append(loss)
            pass
        train_acc_data.append(np.mean(acc_array))
        
        pass
    
    
    pass


# loading data
train_data = pickle.load(open('./train_data.pickle', 'rb'))
val_data = pickle.load(open('./val_data.pickle', 'rb'))

# converting data into a PyTorch Dataset
new_train_data = CustomDataset(train_data)
new_val_data = CustomDataset(val_data)

# creating data loaders
loaders = {
    'train' : torch.utils.data.DataLoader(new_train_data, 
                                          batch_size=32, 
                                          shuffle=True, 
                                          num_workers=1),
    
    'test'  : torch.utils.data.DataLoader(new_val_data, 
                                          batch_size=32, 
                                          shuffle=True, 
                                          num_workers=1),
}

# defining loss and optimizer functions
loss_func = nn.CrossEntropyLoss(); print(loss_func)   
optimizer = torch.optim.Adam(cnn.parameters(), lr= 1e-4); print(optimizer)

# creating the model
cnn= CNN()

# training and validating
num_epochs = 3
train_acc_data = []
loss_data = []
val_acc_data = []
val_loss_data = []
epochs_arr = []

train(num_epochs, cnn, loaders)


# performance analysis (loss, accuracy, cm)
plt.figure(figsize=(10,5))
fig, axs = plt.subplots(1,2, figsize=(15, 5), gridspec_kw={'wspace': 0.5})

axs[0].plot(train_acc_data, label='Train')
axs[0].plot(val_acc_data, label='Val')
axs[0].set_title('Train vs Validation Accuracy')
axs[0].set_xlabel('Epochs')
axs[0].set_ylabel('Accuracy')
axs[0].legend()


axs[1].plot(loss_data, label='Train Loss')
axs[1].plot(val_loss_data, label='Val Loss')
axs[1].set_title('Train Loss')
axs[1].set_xlabel('Epochs')
axs[1].set_ylabel('Loss')
axs[1].legend()

plt.tight_layout()
plt.show()